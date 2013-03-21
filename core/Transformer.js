var Transformer = {
    transformComment: null,
    transformKeyValue: null,
    insert: function(input, newValues) { /* merge newValues dans input selon la convention de la plateforme (utilisation d'un commentaire pour séparer ce qui est généré */  }
};
var EOL = require('os').EOL;

var iOSTransformer = {
    transformComment: function(comment) {
        return "// " + comment;
    },
    transformKeyValue: function(key, value) {
        var normalizedValue = value.replace(/%newline%/gi,"\\n");
        normalizedValue = normalizedValue.replace(/"/gi,'\\"');
        normalizedValue = normalizedValue.replace(/%([@df])/gi,'%$1');
        normalizedValue = normalizedValue.replace(/%s/gi,"%@");

        return '"' + key + '" = "' + normalizedValue + '";';
    },
    AUTOGENERATED_TAG: '// AUTO-GENERATED',
    insert: function(input, newValues) {
        if(!input) {
            input = '';
        }

        var generatedIndex = input.indexOf(iOSTransformer.AUTOGENERATED_TAG);
        if(generatedIndex >= 0) {
            input = input.substr(0, generatedIndex);
        }

        var output = input + EOL + iOSTransformer.AUTOGENERATED_TAG + EOL + newValues;

        return output;
    }
};

var androidTransformer = {
    transformComment: function(comment) {
        return "<!-- " + comment + " -->";
    },
    transformKeyValue: function(key, value) {
        var normalizedValue = value.replace(/%newline%/gi,"\\n");
        normalizedValue = normalizedValue.replace(/'/gi,"\\'");
        normalizedValue = normalizedValue.replace(/%([sdf])/gi,'%#$$$1');
        normalizedValue = normalizedValue.replace(/&/gi,"&amp;");
        normalizedValue = normalizedValue.replace(/\u00A0/gi,"\\u00A0");

        var ouput = '<string name="' + key + '">' + normalizedValue + '</string>';

        var currPos = 0,nbOcc = 1,newStr = "";
        while((currPos = ouput.indexOf("%#$", currPos)) != -1) {
            ouput = setCharAt(ouput,currPos+1,nbOcc);
            ++currPos;
            ++nbOcc;
        }

        return ouput;
    },
    AUTOGENERATED_TAG: '<!-- AUTO-GENERATED -->',
    insert: function(input, newValues) {
        var AUTOGENERATED_TAG = androidTransformer.AUTOGENERATED_TAG;

        if(!input) {
            input = '';
        }

        var output = '';
        var closeTagIndex = input.indexOf('</resources>');
        if(closeTagIndex < 0) {
            output = input + '<resources>';
        } else {
            var autoGeneratedIndex = input.indexOf(AUTOGENERATED_TAG);
            if(autoGeneratedIndex >= 0) {
                output = input.substr(0, autoGeneratedIndex);
            } else {
                output = input.substr(0, closeTagIndex);
            }
        }

        output += EOL + AUTOGENERATED_TAG + EOL + newValues + EOL + '</resources>';

        return output;
    }
};

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}


module.exports = {'ios': iOSTransformer, 'android': androidTransformer };