module.exports = function (plop) {
    // create your generators here
    plop.setGenerator('component', {
        description: 'A generator for React components',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Component name',
            },
        ],
        actions: [
            {
                type: 'addMany',
                destination: 'src/components/{{toLowerCase name}}',
                base: `plop-templates/`,
                templateFiles: 'plop-templates/*',
            },
        ],
    });

    plop.setGenerator('page', {
        description: 'A generator for React components',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Component name',
            },
        ],
        actions: [
            {
                type: 'addMany',
                destination: 'src/pages/{{toLowerCase name}}',
                base: `plop-templates/`,
                templateFiles: 'plop-templates/*',
            },
        ],
    });


    plop.setHelper('toLowerCase', function (text) {
        return text.toLowerCase();
    });
};

