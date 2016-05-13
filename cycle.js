const Rx = require('rx');

function main(sources) {

    function test(e) {
        if (e.req.url == '/test') {
            var data = [
                {
                    "id": 2,
                    "territoryType": 258,
                    "name": "Bakı şeheri",
                    "isCenter": false,
                    "polygonGisid": 2,
                    "urisId": "55A523B5B41D4D028E38CAC00A0509DD",
                    "parent": null
                },
                {
                    "id": 10100001,
                    "territoryType": 259,
                    "name": "Sederek rayonu",
                    "isCenter": false,
                    "polygonGisid": 10100000,
                    "urisId": "78B8A74CFB354983A341722CF5855997",
                    "parent": null
                },
                {
                    "id": 10200001,
                    "territoryType": 259,
                    "name": "şerur rayonu",
                    "isCenter": false,
                    "polygonGisid": 10200000,
                    "urisId": "9D313650007C47E199CB49508BCA6178",
                    "parent": null
                }
            ];

            console.log(data);

            data = JSON.stringify(data);

            e.res.end(data);
        }
    }

    return {
        HTTP: sources.HTTP.tap(e => test(e))
    }
}

function makeHttpEffect() {
    const requests_ = new Rx.Subject();
    return {

        writeEffect: function (model_) {
            model_.subscribe(e => {
                e.res.writeHead(200, { 'Content-Type': 'text/plain' });
                e.res.end('')
            });
            return requests_
        },

        serverCallback: (req, res) => {
            requests_.onNext({ req: req, res: res })
        },

        readEffect: requests_
    }
}

const httpEffect = makeHttpEffect();
const drivers = {
    HTTP: httpEffect
};

function run(main, drivers) {
    const sources = {
        HTTP: drivers.HTTP.readEffect
    };
    const sinks = main(sources);
    Object.keys(drivers).forEach(key => {
        drivers[key].writeEffect(sinks[key])
    })
}

run(main, drivers);

const http = require('http');
const hostname = '127.0.0.1';
const port = 1337;

http.createServer(httpEffect.serverCallback)
    .listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`)
    });