'use strict';
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('appname', {
      desc: 'Name for the cloud function',
      required: false,
      type: String
    });

    this.argument('activities', {
      desc: 'Space-separated list of activities in format name:template',
      required: false,
      type: Array
    });
  }

  initializing() {
    if (this.options.activities) {
      this.composeWith(require.resolve('../activity'), {
        arguments: this.options.activities
      });
    }
  }

  async prompting() {
    if (!this.options.appname) {
      this.answers = await this.prompt([
        {
          type: 'input',
          name: 'appname',
          message: "Your cloud function's name:",
          default: 'myfunction'
        },
        {
          type: 'confirm',
          name: 'addactivities',
          message: 'Do you want to add an activity?',
          default: false
        }
      ]);

      if (this.answers.addactivities) {
        this.composeWith(require.resolve('../activity'));
      }
    }
  }

  writing() {
    const appname = this.options.appname ? this.options.appname : this.answers.appname;

    this.destinationRoot(this.destinationRoot() + '/' + appname);

    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      { appname: appname }
    );

    this.fs.copy(
      this.templatePath('gcloudignore'),
      this.destinationPath('.gcloudignore')
    );

    this.fs.copy(
      this.templatePath('gitkeep'),
      this.destinationPath('activities/.gitkeep')
    );

    this.fs.copy(
      this.templatePath('gitkeep'),
      this.destinationPath('activities/common/.gitkeep')
    );

    this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));
    this.fs.copy(this.templatePath('index.js'), this.destinationPath('index.js'));
    this.fs.copy(this.templatePath('app.js'), this.destinationPath('app.js'));
  }

  install() {
    this.npmInstall();
  }
};
