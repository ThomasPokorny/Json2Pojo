
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

            if((obj[key]).length == 0 ) {
                console.log('\tpublic List<Object> '  + key + ';');
            } else 
            if(typeof (obj[key])[0] == 'string') {        
                console.log('\tpublic List<String> '  + key + ';');
            } else 
            if(typeof (obj[key])[0] == 'number') {        
                console.log('\tpublic List<Integer> '  + key + ';');
            } else {
                console.log('\tpublic List<' + capitalize(key) + '> '  + key + ';');
                subClasses.push({fieldName: key, val:obj[key][0] });
            }

        }  else 
        if(obj[key] == null) {
            console.log('\tpublic Object '  + key + ';');
        } else 
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

let json = '{"menu": "we", "something": {"a1":12 , "a2":"sd"}, "hello":null , "arr": [1,2,3,4], "names": ["1","2","3","4"], "geeks":[{"c":"", "c1":""} ,{"c":"", "c1":""} ] }';
toPojo(json, 'RootElement');
//console.log(fields);