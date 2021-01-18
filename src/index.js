require("@babel/register")({
    presets: ["@babel/preset-env"],
    plugins: [
        [
            "@babel/plugin-transform-runtime",
            {
                "absoluteRuntime": false,
                "corejs": false,
                "helpers": true,
                "regenerator": true,
                "useESModules": false,
                "version": "7.0.0-beta.0"
            }
        ]
    ]

});


require("./server").startup();
