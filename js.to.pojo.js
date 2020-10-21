
const mySet = new Set('string', 'integer');

//ar obj = { first: "John", last: 1, em:  [ {a:1} ,  {a:1}] };


function toPojo(jsonString, identifier) {
    let obj = JSON.parse(jsonString);

    let subClasses = [];
    // TODO: save in var  
    // NOTE: this is a fast draft oin where the result is just printed to the console
    console.log('public class ' + identifier + ' {');

    Object.keys(obj).forEach(function(key) {
        if(typeof obj[key] == 'string') {
            console.log('\tpublic String '  + key + ';');
        } else
        if(typeof obj[key] == 'number') {
            console.log('\tpublic Integer '  + key + ';');
        } else
        if (Array.isArray(obj[key])) {
            console.log('\tpublic List<Object> '  + key + ';');
        }  else 
        {
            console.log('\tpublic ' + capitalize(key) + ' '  + key + ';');
            subClasses.push({fieldName: key, val:obj[key]});
        }
    });

    console.log('}');
    console.log('');

    subClasses.forEach(c => {
        toPojo(JSON.stringify(c.val), capitalize(c.fieldName));
    });
}

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

function determinFields(jsonString) {
    let obj = JSON.parse(jsonString);
    let fields = { stdField: [], arrayFields: [], objectFields: [] };

    Object.keys(obj).forEach(function(key) {
        if(typeof obj[key] == 'string' || typeof obj[key] == 'number') {
            fields.stdField.push({fieldName: key, type: typeof obj[key]});
        } else
        if (Array.isArray(obj[key])) {
            fields.stdField.push({fieldName: key, type: typeof obj[key], val:obj[key]});
        }  else 
        {
            fields.stdField.push({fieldName: key, type: typeof obj[key], val:obj[key]});
        }
    });

    return fields;
}

let json = '{"menu": "we", "something": {"a1":12 , "a2":"sd"} }';
toPojo(json, 'RootElement');
//console.log(fields);