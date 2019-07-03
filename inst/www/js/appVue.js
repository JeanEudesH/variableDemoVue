// comment out this line from development 
// ocpu.seturl("http://0.0.0.0:8004/ocpu/library/compareVariableDemoVue/R");

var App = new Vue({
  el: "#DemoApp",
  data: {
    wsParams: {
        token: "",
        wsUrl: "",
        params: new window.URLSearchParams(window.location.search),
        hideIdentificationInputs: false   
       },
    variable: {
      selectParameters:{
        multiple: false,
        maximumSelectionLength: 2
      },        
        RfunctionName: "variableList",
    },
    provenance: {
      selectParameters:{
        multiple: false,
        maximumSelectionLength: 2
      },        
      RfunctionName: "provenanceList"
    },
    scientificobject: {
      selectParameters:{
        multiple: false,
        maximumSelectionLength: 10
      },        
      RfunctionName: "scientificobjectList"
    },
    graphParameters: {
        iframeInput: "plotDiv",
        functionName: "plotVarDemo",
        plotVarParameters: "",
        outputName: "plotWidget.html"
    },

  },  mounted:function(){
    this.initialize();
   },
  methods: {
    initialize: function (){
        if ( this.wsParams.params.get("accessToken") != null) {
          this.wsParams.token = this.wsParams.params.get("accessToken");
        } else {
          this.wsParams.token = $("#token").val();
        }
        if (this.wsParams.params.get("wsUrl") != null) {
          this.wsParams.wsUrl = this.wsParams.params.get("wsUrl");
        } else {
          this.wsParams.wsUrl = $("#wsUrl").val();
        }
        if(this.wsParams.params.get("accessToken") != null && this.wsParams.params.get("wsUrl") != null){
          this.wsParams.hideIdentificationInputs = true;
          $("#wsForm").css("display","none");
          this.loadVariables('variable');
          this.loadVariables('scientificobject');
          this.loadVariables('provenance');
        }
    },
    fillListInput: function(inputId, inputList){
        inputData = [];
        inputData.push({id: "", text: "No filter"});
        inputList.forEach(function(inputItem) {
            item = {};
            item.id = inputItem.uri;
            item.text = inputItem.label;
            inputData.push(item);
          });
          // console.log(inputData);
          defaultSelectParameters = {
            data: inputData,
            multiple: this[inputId].selectParameters.multiple,
            maximumSelectionLength: this[inputId].selectParameters.maximumSelectionLength,
          };
          // merge objects
          finalSelectParameters = { ...defaultSelectParameters };
          $("#" + inputId).select2(finalSelectParameters);
    },
    loadVariables: function (inputId){
        // test token send in url
        if (this.wsParams.token == null || this.wsParams.token == "") {
          alert("An accessToken is required");
        return false;
        } 
        if (this.wsParams.wsUrl == null || this.wsParams.wsUrl == "") {
          alert("A wsUrl is required");
        return false;
        } 
        $("#cssLoader").addClass("is-active");
        var self = this
        inputData = [];
        inputList = [];
        // Fill variables
        // the arguments of the function ocpu.rpc are findable here :
        // https://www.opencpu.org/jslib.html#lib-jsonrpc
        return ocpu.rpc(
          //Create array of variables' options
          // R function name
          this[inputId].RfunctionName,
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
        ).fail(function() {
          $("#cssLoader").removeClass("is-active");
          alert("Error: Token or wsURL not valid");
        });
    },
    showGraph: function(){
        $("#cssLoader").addClass("is-active");
        // Run the R function
        var varURIs = $("#variable").val();
        var provURIs = $("#provenance").val();
        var objURIs = $("#scientificobject").val();
        var outputName = this.graphParameters.outputName;
        var iframeInput = this.graphParameters.iframeInput;
        return(req = ocpu.call(
            this.graphParameters.functionName,
            {
                token: this.wsParams.token,
                wsUrl: this.wsParams.wsUrl,
                varURI: varURIs,
                provUri: provURIs,
                scientificobjectUri: objURIs
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
            alert("An error has append : " + request.responseText);
          })
        );
    }
  }
})
