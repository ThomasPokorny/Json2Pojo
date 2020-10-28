function toPojo(pojos, jsonString, identifier) {
    let obj = JSON.parse(jsonString);

    let pojo = '';
    let subClasses = [];

    pojo += 'public class ' + identifier + ' {\n';

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

    pojos.push(pojo);

    subClasses.forEach(c => {
        toPojo(pojos, JSON.stringify(c.val), capitalize(c.fieldName));
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

    try{
        let pojos = [];
        let json = document.getElementById("json").value;

        toPojo(pojos, json,  rootElementClassName);

        pojos.forEach(p => {
            document.getElementById("pojos").value += p + '\n\n';    
        }) 
    }catch (error){
        console.log(error);
        document.getElementById("pojos").value = 'Error parsing JSON';
    } 
}






