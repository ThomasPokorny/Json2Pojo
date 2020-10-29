function toPojo(pojos, jsonString, config) {
    let obj = JSON.parse(jsonString);

    let pojo = '';
    let subClasses = [];

    let isListUsed = false;

    pojo += 'public class ' + config.identifier + ' {\n';

    Object.keys(obj).forEach(function(key) {
        if(typeof obj[key] == 'string') {
            pojo += '\tpublic String '  + key + ';\n';
        } else
        if(typeof obj[key] == 'number') {
        	if(Number.isSafeInteger(obj[key])){
        		pojo += '\tpublic Integer '  + key + ';\n';
        	}else 
                pojo += '\tpublic Double '  + key + ';\n';
        } else
        if(typeof obj[key] == 'boolean') {
            pojo += '\tpublic boolean '  + key + ';\n';
        } else
        if (Array.isArray(obj[key])) {
            if((obj[key]).length == 0 ) {
                pojo += '\tpublic List<Object> '  + key + ';\n';
            } else 
            if(typeof (obj[key])[0] == 'string') {        
                pojo += '\tpublic List<String> '  + key + ';\n';
            } else 
            if(typeof (obj[key])[0] == 'number') {
            	isIntArray = true;
            	for(number of obj[key]) {
            		if(!(Number.isSafeInteger(number))){
            			isIntArray = false;
            			break;
            		}
    			}
                if(isIntArray)
                    pojo += '\tpublic List<Integer> '  + key + ';\n';
                else   
                    pojo += '\tpublic List<Double> '  + key + ';\n';
            } else 
            if(typeof (obj[key])[0] == 'boolean') {        
                pojo += '\tpublic List<Boolean> '  + key + ';\n';
            } else {
                pojo += '\tpublic List<' + capitalize(key) + '> '  + key + ';\n';
                subClasses.push({fieldName: key, val:obj[key][0] });
            }

            isListUsed = true;
        }  else 
        if(obj[key] == null) {
            pojo += '\tpublic Object '  + key + ';\n';
        } else 
        {
            pojo += '\tpublic ' + capitalize(key) + ' '  + key + ';\n';
            subClasses.push({fieldName: key, val:obj[key]});
        }
    });

    pojo += '}';

    if(config.isCreateImpots && isListUsed) {
        pojo = 'import java.util.List;\n' + pojo;
    }

    if(config.isPackage) {
        pojo = 'package ' + config.packageDefinition + ';\n' + pojo;
    }
    pojos.push(pojo);

    subClasses.forEach(c => {
        config.identifier = capitalize(c.fieldName);
        toPojo(pojos, JSON.stringify(c.val), config);
    });
}

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

const parse = () => {
    
    // clear converter textarea
    document.getElementById("pojos").value = ''; 
    let rootElementClassName = document.getElementById("root-element").value;

    if(rootElementClassName == '') {
        rootElementClassName = 'RootElement';
    }

    let packageDefinition = "com.foobar.pojo";
    let isPackage = false;
    if(document.getElementById('package-options').style.visibility == 'visible' && document.getElementById("package-definition").value != '') {
        packageDefinition = document.getElementById("package-definition").value;
        isPackage = true;
    }

    let isCreateImpots = false;
    if(document.getElementById('advanced-options').style.visibility == 'visible' && document.getElementById("import-options").checked) {
        isCreateImpots = true;
    }

    let config = {};
    config.identifier = rootElementClassName;
    config.packageDefinition = packageDefinition;
    config.isPackage = isPackage;
    config.isCreateImpots = isCreateImpots;

    try{
        let pojos = [];
        let json = document.getElementById("json").value;

        toPojo(pojos, json,  config);

        pojos.forEach(p => {
            document.getElementById("pojos").value += p + '\n\n';    
        }) 
    }catch (error){
        console.log(error);
        document.getElementById("pojos").value = 'Error parsing JSON';
    } 
}

const optionsClick = (o) => {
    let isVisible = document.getElementById(o).style.visibility;
    if(isVisible == 'hidden') {
        document.getElementById(o).style.visibility = 'visible';
    } else {
        document.getElementById(o).style.visibility = 'hidden';
    }
}
