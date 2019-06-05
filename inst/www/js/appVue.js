// comment out this line from development 
//ocpu.seturl("http://0.0.0.0:8004/ocpu/library/compareVariableDemo/R");

var App = new Vue({
  el: "#DemoApp",
  data: {
    wsParams: {
        token: "",
        wsUrl: "",
        params: new window.URLSearchParams(window.location.search)
    },
    listParameters: {
        multiple: true,
        maximumSelectionLength: 2,
        RfunctionName: "variableList",
        inputId: "variable"
    },
    graphParameters: {
        iframeInput: "plotDiv",
        functionName: "plotVarDemo",
        plotVarParameters: "",
        outputName: "plotWidget.html"
    },

  },
  methods: {
    initialize: function (){
        if ($("#token").length != 0) {
          this.wsParams.token = $("#token").val();
        } else {
          this.wsParams.token = this.wsParams.params.get("accessToken");
        }
        if ($("#wsUrl").length != 0) {
          this.wsParams.wsUrl = $("#wsUrl").val();
        } else {
          this.wsParams.wsUrl = this.wsParams.params.get("wsUrl");
        }
    },
    fillListInput: function(inputId, inputList){
        selectParameters = [
            this.wsParams.token,
            this.wsParams.wsUrl
        ]
        inputList.forEach(function(inputItem) {
            item = {};
            item.id = inputItem.uri;
            item.text = inputItem.label;
            inputData.push(item);
          });
          // console.log(inputData);
          defaultSelectParameters = {
            data: inputData
          };
          // merge objects
          finalSelectParameters = { ...defaultSelectParameters, ...selectParameters };
          $("#" + inputId).select2(finalSelectParameters);
    },
    setListInputFromRList: function(inputId){
        $("#cssLoader").addClass("is-active");
        var self = this
        inputData = [];
        // Fill variables
        // the arguments of the function ocpu.rpc are findable here :
        // https://www.opencpu.org/jslib.html#lib-jsonrpc
        return ocpu.rpc(
          //Create array of variables' options
          // R function name
          this.listParameters.RfunctionName,
          // list of arguments names and value
          {
              token: this.wsParams.token,
              wsUrl: this.wsParams.wsUrl
          },
      
          function(inputList) {
            self.fillListInput(inputId, inputList);
            $("#cssLoader").removeClass("is-active");
            return inputList;
          }
        ).fail(function(request) {
          $("#cssLoader").removeClass("is-active");
          alert("Error: Token or wsURL not valid");
        });
    },
    loadVariables: function (inputId ){
        this.initialize();
        // test token send in url
        if (this.wsParams.token == null || this.wsParams.token == "") {
          alert("An accessToken is required");
        return false;
        } 
        if (this.wsParams.wsUrl == null || this.wsParams.wsUrl == "") {
          alert("A wsUrl is required");
        return false;
        } 
        this.setListInputFromRList(inputId = inputId);
    },
    showGraph: function(){
        $("#cssLoader").addClass("is-active");
        // Run the R function
        var varURIs = $("#variable").val();
        var outputName = this.graphParameters.outputName;
        var iframeInput = this.graphParameters.iframeInput;
        return(req = ocpu.call(
            this.graphParameters.functionName,
            {
                token: this.wsParams.token,
                wsUrl: this.wsParams.wsUrl,
                varURI: varURIs
            },
            function(session) {
            $("#" + iframeInput).attr(
              "src",
              session.getFileURL(outputName)
            );
            $("#submit").removeAttr("disabled");
            $("#cssLoader").removeClass("is-active");
          }).fail(function(request) {
            $("#submit").removeAttr("disabled");
            $("#cssLoader").removeClass("is-active");
            alert("An unknown error has append : " + request.responseText);
          })
        );
    }
  }
})