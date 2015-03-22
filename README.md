Scafall
=======

A simple project scaffolding tool.

## Installation

Scafall should be installed globally.

```
$ npm install -g scafall
```

## Creating a new project
Projects are created within the current working directory using the
`scafall init` command and specifying a generator.

```
$ mkdir my-new-site
$ cd my-new-site
$ scafall init wordpress
```

## Installing generators

Before creating a project you will need to have a generator installed.
Generators are separate npm packages and can be installed using the
`scafall install` command or `npm install` directly.

Using scafall:

```
$ scafall install wordpress
```

or

```
$ scafall i wordpress
```

Using npm:

```
$ npm install -g scafall-wordpress
```

The npm packages for generators all use a name of the form `scafall-*`.
The `scafall-` prefix can be omitted when using `scafall install` but is
required when using `npm install`. Also, if using `npm install` you should
install the generator globally.

## Uninstalling generators

Generators can be uninstalled using the `scafall uninstall` command or
`npm uninstall` directly.

Using scafall:

```
$ scafall uninstall wordpress
```

or

```
$ scafall rm wordpress
```

Using npm:

```
$ npm uninstall -g scafall-wordpress
```

## List installed generators

You can view a list of the currently installed generators using the
`scafall list` command.

```
$ scafall list
```

or

```
$ scafall ls
```
