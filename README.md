# Noootes

[![Build Status](https://travis-ci.org/KK578/noootes.svg)](https://travis-ci.org/KK578/noootes)

A WebApp for collaborating on notes.

## How's it Built

Noootes uses [Polymer] and [Firebase] to deliver a Material Design app with real time data updates.

[Polymer] delivers Material Design to the web, and provides the capability from WebComponents and Custom Elements, to build encapsulated elements that work as standard HTML Elements.

[Firebase] provides numerous features for this WebApp. Authentication, a real-time database and hosting.

[Polymer]: https://www.polymer-project.org/
[Firebase]: https://www.firebase.com/

## Contributing

### Setting up Your Local Fork

#### Installing Dependencies

*Note: The version of generator-polynode that this project is using has not yet been published.*

```bash
npm install
(sudo) npm install -g grunt-cli
(sudo) npm install -g yo
(sudo) npm install -g generator-polynode
```

#### Running

```bash
grunt
grunt serve
```

#### Adding new features

*Note: The version of generator-polynode that this project is using has not yet been published.*

If adding a new custom element to `custom_components/`, please use `yo polynode:element` to template a new element.

If adding a new page to `custom_components/pages/`, please use `yo polynode:page` to template a new page element.

#### Testing

WebComponent Testing (WCT) can be achieved either via the terminal or through a web interface.  
I suggest using the web interface on your installed browsers.

##### Web Interface

With the server running in development mode (You can ensure this by using `grunt reserve`), navigate to `localhost:5000/test/`.  
WCT will now run all tests found for Custom Elements in `browser/test/`.

##### Terminal

*Note: Requires Java to be installed and accessible via the terminal.  
Windows Users may also need to run the terminal in Administrator mode while installing.*

```bash
npm install -g web-component-tester
wct
```

Alternatively, if you have a SauceLabs account, you may be able to run tests remotely like so:

```bash
export SAUCE_USERNAME=*Your SauceLabs Username*
export SAUCE_ACCESS_KEY=*Your SauceLabs Access Key*
wct --plugins sauce
```

### Making a Pull Request

Please ensure your pull request is styled to the project by using `grunt lint`.  
If your code is not properly styled, Travis-CI will not build your pull request.

## License

> [BSD License](http://opensource.org/licenses/bsd-license.php)

> Copyright (c) 2015, Kevin Kwan.
> All rights reserved.

> Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

> 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
> 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

> THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
