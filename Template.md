# The Template Class

### The Example

`./views/layout.tmpl:`

```html
<!DOCTYPE html>

<html lang="en-US">
  <head></head>
  <body><%= data.content %></body>
</html>
```

`./views/profile.tmpl:`

```html
<% switch ( data.gender ) {
  case 'female':
    print( '<p>' + data.username + ' is a girl.</p>' );
    break;
  case 'male':
    print( '<p>' + data.username + ' is a boy.</p>' );
    break;
  default:
    print( '<p>We do not know who is ' + data.username + '.</p>' );
} %>
```

`./main.coffee:`

```coffee
Template = require './Template'

layout = new Template './views/', 'layout'

data =
  username: 'John Smith'
  gender:   'male'

html = layout.render 'profile', data

console.log html
```

Run it: `$ coffee main.coffee`

```html
<!DOCTYPE html>

<html lang="en-US">
  <head></head>
  <body><p>John Smith is a boy.</p>
</body>
</html>
```
