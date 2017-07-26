window.onload = function () {
    init();

    // create unique identifier per client
  const userId = `${Date.now()}_${Math.floor(Math.random() * 2000)}`;
    // const heading = document.getElementById('heading');
    // heading.innerHTML += `: ${userId}`;

  const socket = io('/');

    // initialize instance
  const connector = new operam.connection.SocketConnector(socket, 'flowchart-shared');
  const currentDocument = new operam.core.Document(connector);
  const engine = new operam.OTEngine(currentDocument, userId);

  engine.start()
        .then(() => {
          const objects = engine.get('object', () => {
            const nodes = engine.newMap();

            // Initialize default nodes
            nodes.set(-1, JSON.stringify({"key":-1, "category":"Start", "loc":"-335 1", "text":"Start"}));
            nodes.set(-2, JSON.stringify({"text":"Distributor memproduksi barang", "key":-2, "loc":"-335 88"}));
            nodes.set(-3, JSON.stringify({"text":"Barang disimpan dalam gudang", "key":-3, "loc":"-335 166"}));
            nodes.set(-4, JSON.stringify({"text":"Agen memesan barang ke distributor\n", "key":-4, "loc":"-335 251"}));
            nodes.set(-5, JSON.stringify({"text":"Stok barang\ntersedia?\n", "figure":"Diamond", "key":-5, "loc":"-335 363"}));
            nodes.set(-6, JSON.stringify({"text":"Agen melakukan transaksi dengan distributor", "key":-6, "loc":"-335 482"}));
            nodes.set(-7, JSON.stringify({"text":"Status\ntransaksi\nberhasil?\n", "figure":"Diamond", "key":-7, "loc":"-335 624"}));
            nodes.set(-8, JSON.stringify({"text":"Barang dikirim ke agen", "key":-8, "loc":"12 92"}));
            nodes.set(-9, JSON.stringify({"text":"Kondisi\nbarang\nlayak?", "figure":"Diamond", "key":-9, "loc":"12 205"}));
            nodes.set(-10, JSON.stringify({"text":"Barang dikembalikan", "key":-10, "loc":"12 355"}));
            nodes.set(-11, JSON.stringify({"text":"Barang dipasarkan", "key":-11, "loc":"220 230"}));
            nodes.set(-12, JSON.stringify({"text":"Barang\nlaku\ndipasarkan?", "figure":"Diamond", "key":-12, "loc":"220 464"}));
            nodes.set(-13, JSON.stringify({"text":"Barang dikirim ke pembeli", "key":-13, "loc":"441 464"}));
            nodes.set(-14, JSON.stringify({"category":"End", "text":"End", "key":-14, "loc":"441 580"}));
            nodes.set(-15, JSON.stringify({"category":"Comment", "text":"Diagram tentang proses penjualan barang oleh agen", "key":-15, "loc":"246 74"}));

            return nodes;
          });

          const relations = engine.get('relation', () => {
            const links = engine.newMap();

            // Initialize default links
            links.set(-1, JSON.stringify({"key":-1, "from":-1, "to":-2, "fromPort":"B", "toPort":"T", "points":[ -334.99999999999994,25.773340092148892,-334.99999999999994,35.77334009214889,-334.99999999999994,44.69894574187522,-335,44.69894574187522,-335,53.62455139160156,-335,63.62455139160156 ]}));
            links.set(-2, JSON.stringify({"key":-2, "from":-2, "to":-3, "fromPort":"B", "toPort":"T", "points":[ -335,112.37544860839843,-335,122.37544860839843,-335,127,-335,127,-335,131.62455139160156,-335,141.62455139160156 ]}));
            links.set(-3, JSON.stringify({"key":-3, "from":-3, "to":-4, "fromPort":"B", "toPort":"T", "points":[ -335,190.37544860839841,-335,200.37544860839841,-335,204.53113784790037,-335,204.53113784790037,-335,208.68682708740235,-335,218.68682708740235 ]}));
            links.set(-4, JSON.stringify({"key":-4, "from":-4, "to":-5, "fromPort":"B", "toPort":"T", "points":[ -335,283.3131729125977,-335,293.3131729125977,-335,293.3131729125977,-335,288.8736541748047,-335,288.8736541748047,-335,298.8736541748047 ]}));
            links.set(-5, JSON.stringify({"key":-5, "from":-5, "to":-6, "fromPort":"B", "toPort":"T", "visible":true, "points":[ -335,427.12634582519536,-335,437.12634582519536,-335,438.40658645629884,-335,438.40658645629884,-335,439.6868270874023,-335,449.6868270874023 ], "text":"Ya"}));
            links.set(-6, JSON.stringify({"key":-6, "from":-5, "to":-2, "fromPort":"R", "toPort":"R", "visible":true, "points":[ -233.78274536132812,363,-223.78274536132812,363,-217,363,-217,88,-241.96168518066406,88,-251.96168518066406,88 ], "text":"Tidak"}));
            links.set(-7, JSON.stringify({"key":-7, "from":-6, "to":-7, "fromPort":"B", "toPort":"T", "points":[ -335,514.3131729125976,-335,524.3131729125976,-335,529.155689239502,-335,529.155689239502,-335,533.9982055664062,-335,543.9982055664062 ]}));
            links.set(-8, JSON.stringify({"key":-8, "from":-7, "to":-3, "fromPort":"L", "toPort":"L", "visible":true, "points":[ -416.6753845214844,624,-426.6753845214844,624,-473,624,-473,166,-412.9667282104492,166,-402.9667282104492,166 ], "text":"Tidak"}));
            links.set(-9, JSON.stringify({"key":-9, "from":-7, "to":-8, "fromPort":"R", "toPort":"T", "visible":true, "points":[ -253.32461547851562,624,-243.32461547851562,624,-160,624,-160,57.62455139160156,12,57.62455139160156,12,67.62455139160156 ], "text":"Ya"}));
            links.set(-10, JSON.stringify({"key":-10, "from":-8, "to":-9, "fromPort":"B", "toPort":"T", "points":[ 12,116.37544860839843,12,126.37544860839843,12,128.62455139160156,12,128.62455139160156,12,130.8736541748047,12,140.8736541748047 ]}));
            links.set(-11, JSON.stringify({"key":-11, "from":-9, "to":-10, "fromPort":"B", "toPort":"T", "visible":true, "points":[ 12,269.12634582519536,12,279.12634582519536,12,303.84431076049805,12,303.84431076049805,12,328.5622756958008,12,338.5622756958008 ], "text":"Tidak"}));
            links.set(-12, JSON.stringify({"key":-12, "from":-10, "to":-2, "fromPort":"L", "toPort":"R", "points":[ -70.2330093383789,355,-80.2330093383789,355,-102,355,-102,88,-241.96168518066406,88,-251.96168518066406,88 ]}));
            links.set(-13, JSON.stringify({"key":-13, "from":-9, "to":-11, "fromPort":"R", "toPort":"T", "visible":true, "points":[ 82.25091552734375,205,92.25091552734375,205,114.87796020507812,205,114.87796020507812,203.5622756958008,220,203.5622756958008,220,213.5622756958008 ], "text":"Ya"}));
            links.set(-14, JSON.stringify({"key":-14, "from":-11, "to":-12, "fromPort":"B", "toPort":"T", "points":[ 220,246.43772430419924,220,256.43772430419926,220,323.15568923950195,220,323.15568923950195,220,389.8736541748047,220,399.8736541748047 ]}));
            links.set(-15, JSON.stringify({"key":-15, "from":-12, "to":-10, "fromPort":"L", "toPort":"R", "visible":true, "points":[ 117.1363525390625,464,107.1363525390625,464,105.6846809387207,464,105.6846809387207,355,104.2330093383789,355,94.2330093383789,355 ], "text":"Tidak"}));
            links.set(-16, JSON.stringify({"key":-16, "from":-12, "to":-13, "fromPort":"R", "toPort":"L", "visible":true, "points":[ 322.8636474609375,464,332.8636474609375,464,346.92484283447266,464,346.92484283447266,464,360.9860382080078,464,370.9860382080078,464 ], "text":"Ya"}));
            links.set(-17, JSON.stringify({"key":-17, "from":-13, "to":-14, "fromPort":"B", "toPort":"T", "points":[ 441,488.3754486083985,441,498.3754486083985,441,523.8767097739286,441,523.8767097739286,441,549.3779709394588,441,559.3779709394588 ]}));

            return links;
          });
          operam.FlowchartBinder.load(objects, relations, myDiagram);

          operam.FlowchartBinder.bind(objects, relations, myDiagram);
        });
};
