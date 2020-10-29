
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