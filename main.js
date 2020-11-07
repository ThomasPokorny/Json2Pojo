
const parse = () => {
    
    // clear converter textarea
    document.getElementById("pojos").value = ''; 
    let rootElementClassName = document.getElementById("root-element").value;

    if(rootElementClassName == '') {
        rootElementClassName = 'RootElement';
    }

    /* Advanced Options */

    // package naming
    let packageDefinition = "com.foobar.pojo";
    let isPackage = false;
    if(document.getElementById('package-options').style.visibility == 'visible' && document.getElementById("package-definition").value != '') {
        packageDefinition = document.getElementById("package-definition").value;
        isPackage = true;
    }

    // auto generation of import statements
    let isCreateImpots = false;
    if(document.getElementById('advanced-options').style.visibility == 'visible' && document.getElementById("import-options").checked) {
        isCreateImpots = true;
    }

    // access modifier 'private' for created fields
    let isPrivateFields = false;
    if(document.getElementById('advanced-options').style.visibility == 'visible' && document.getElementById("private-options").checked) {
        isPrivateFields = true;
    }

    // create getter and setter methods
    let isCreateGS = false;
    if(document.getElementById('advanced-options').style.visibility == 'visible' && document.getElementById("gs-options").checked) {
        isCreateGS = true;
    }

    // create builder methods
    let isBuilder = false;
    if(document.getElementById('advanced-options').style.visibility == 'visible' && document.getElementById("builder-options").checked) {
        isBuilder = true;
    }

    let config = {};
    config.identifier           = rootElementClassName;
    config.packageDefinition    = packageDefinition;
    config.isPackage            = isPackage;
    config.isCreateImpots       = isCreateImpots;
    config.isPrivateFields      = isPrivateFields;
    config.isCreateGS           = isCreateGS;
    config.isBuilder            = isBuilder;

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