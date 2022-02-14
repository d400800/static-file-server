class CoinlistTrader {
    constructor({amount, refreshInterval}) {
        this.audio = new Audio('https://download.samplelib.com/mp3/sample-3s.mp3');

        this.refreshInterval = refreshInterval || 5000;

        this.amount = amount;

        this.currency = (window.location.pathname.split('/'))[3];

    }

    playAudio(audio) {
        return new Promise(res => {
            audio.play();

            audio.onended = res;
        });
    }

    checkAvailableBalance() {
        const availableBalance = parseFloat(
            $(".js-max-send-to-pro")
            .parent()
            .text()
            .split('\n')[2]
            .split(' available')[0]
        );
    
        return availableBalance;
    }

    startCheckingBalance() {
        console.log("Starting checking the available balance.");

        const interval = setInterval(async () => {
           const availableBalance = this.checkAvailableBalance();

           const amountToSend = this.amount || availableBalance;
    
            if (availableBalance > 0) {
                await this.playAudio(this.audio);
                
                console.log(`The available balance is: ${availableBalance}. It's to time sell some tockens!`);
    
                clearInterval(interval);

                this.sendToPro(amountToSend);
            } else {
                console.log("Nothing so far...");

                window.location.reload();
            }
        }, this.refreshInterval);
    }

    sendToPro(amount) {
        try {
            let self = this;
            const customer_wallet_id = $("#send_to_pro_request_customer_wallet_id").val();
            const authenticity_token = $("[name='csrf-token']").attr('content');
            const asset_name = this.currency;

            console.log('sending to Pro: ', {customer_wallet_id, authenticity_token, asset_name, amount});

            $.ajax({
                type: "POST",
                url: "https://coinlist.co/pro/transfers/send_to_pro",
                dataType: "json",
                success: function (msg) {
                    console.log(`${amount} ${asset_name} has been successfully sent to Pro`);

                    self.redirectToPro();
                },
                data: {
                    authenticity_token,
                    send_to_pro_request: {
                        customer_wallet_id: customer_wallet_id,
                        asset_name: asset_name,
                        amount: amount
                    }
                }
            });
        } catch (e) {
            console.log('Something went wrong', e);
        }
    }

    redirectToPro() {
        const proUrl = $('a:contains("Go to CoinList Pro")').attr('href');

        const proUrlSuffix = `/trader/${this.currency.toUpperCase()}-USDT`;

        console.log("Redirecting to", proUrl + proUrlSuffix);

        window.open(proUrl + proUrlSuffix);
    }
}