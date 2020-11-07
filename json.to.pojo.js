function toPojo(pojos, jsonString, config) {
    let obj = JSON.parse(jsonString);

    let pojo = '';
    let subClasses = [];

    let isListUsed = false;

    pojo += 'public class ' + config.identifier + ' {\n';

    // NOTE: determin access modifier from config
    let accessModifier = config.isPrivateFields ? 'private' : 'public';

    // NOTE: getter and setter methods
    let isCreateGS = config.isCreateGS;
    let setterMethods = '';
    let getterMethods = '';

    // NOTE: builder methods
    let isBuilder = config.isBuilder;
    let builderMethods = '';

    Object.keys(obj).forEach(function(key) {
        let fieldType = '';
        let fieldsName = unCapitalize(key);

        if(typeof obj[key] == 'string') {
            pojo += '\t' + accessModifier + ' String '  + unCapitalize(key) + ';\n';
            
            fieldType = 'String';

        } else
        if(typeof obj[key] == 'number') {
        	if(Number.isSafeInteger(obj[key])){
                pojo += '\t' + accessModifier + ' Integer '  + unCapitalize(key) + ';\n';
                fieldType = 'Integer';
        	}else {
                pojo += '\t' + accessModifier + ' Double '  + unCapitalize(key) + ';\n';
                fieldType = 'Double';
            }
        } else
        if(typeof obj[key] == 'boolean') {
            pojo += '\t' + accessModifier + ' boolean '  + unCapitalize(key) + ';\n';
            fieldType = 'boolean';
        } else
        if (Array.isArray(obj[key])) {
            if((obj[key]).length == 0 ) {
                pojo += '\t' + accessModifier + ' List<Object> '  + unCapitalize(key) + ';\n';
                fieldType = 'List<Object>';
            } else 
            if(typeof (obj[key])[0] == 'string') {        
                pojo += '\t' + accessModifier + ' List<String> '  + unCapitalize(key) + ';\n';
                fieldType = 'List<String>';
            } else 
            if(typeof (obj[key])[0] == 'number') {
            	isIntArray = true;
            	for(number of obj[key]) {
            		if(!(Number.isSafeInteger(number))){
            			isIntArray = false;
            			break;
            		}
    			}
                if(isIntArray) {
                    pojo += '\t' + accessModifier + ' List<Integer> '  + unCapitalize(key) + ';\n';
                    fieldType = 'List<Integer>';
                }
                else {
                    pojo += '\t' + accessModifier + ' List<Double> '  + unCapitalize(key) + ';\n';
                    fieldType = 'List<Double>';
                }
            } else 
            if(typeof (obj[key])[0] == 'boolean') {        
                pojo += '\t' + accessModifier + ' List<Boolean> '  + unCapitalize(key) + ';\n';
                fieldType = 'List<Boolean>';
            } else {
                pojo += '\t' + accessModifier + ' List<' + capitalize(key) + '> '  + unCapitalize(key) + ';\n';
                subClasses.push({fieldName: key, val:obj[key][0] });
                fieldType = 'List<' + capitalize(key) + '> ';
            }

            isListUsed = true;
        }  else 
        if(obj[key] == null) {
            pojo += '\t' + accessModifier + ' Object '  + unCapitalize(key) + ';\n';
            fieldType = 'Object';
        } else 
        {
            pojo += '\t' + accessModifier + ' ' + capitalize(key) + ' '  + unCapitalize(key) + ';\n';
            subClasses.push({fieldName: key, val:obj[key]});
            fieldType = capitalize(key);
        }

        // conditional creation of getters and setter
        if(isCreateGS) {
            setterMethods += '\n' + createSetter(fieldType, fieldsName);
            getterMethods += '\n' + createGetter(fieldType, fieldsName);
        }

        // conditional creation of builder methods
        if(isBuilder) {
            builderMethods += '\n' + createBuilder(config.identifier, fieldType, fieldsName);
        }

    });

    // append conditional getter-, setter- and buildermethods to the pojo string
    if(isBuilder) {
        pojo += builderMethods;
    }

    if(isCreateGS) {
        pojo += setterMethods;
        pojo += getterMethods;
    }

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

/*
* UTIL METHODS 
*/

const createGetter = (t, f) => {
    let getter = '\tpublic ' + t + ' get' + capitalize(f) + '() {\n'
    getter += '\t\treturn ' + f + ';\n';
    getter += '\t}\n';
    return getter;
} 

const createSetter = (t, f) => {
    let setter = '\tpublic void set' + capitalize(f) + '(' + t + ' ' + f + ') { \n';
    setter += '\t\tthis.' + f + ' = ' + f + ';\n';
    setter += '\t}\n'; 
    return setter;
} 

const createBuilder = (c, t, f) => {
    let builderS = '\tpublic ' + c + ' ' + f + '(' + t + ' ' + f + ') { \n';
    builderS += '\t\tthis.' + f + ' = ' + f + ';\n';
    builderS += '\t\treturn this;\n';
    builderS += '\t}\n'; 
    return builderS;
} 

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
const unCapitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toLowerCase() + s.slice(1)
  }
