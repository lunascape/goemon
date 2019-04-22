import * as React from 'react';

export const MemberHtml = (props) => {
  return (
    <html>
      <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"/>
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
      <link href="/css/bootstrap.css" rel="stylesheet" media="screen" />
      <link href="/css/style.css" rel="stylesheet" media="screen" />
      <title>Sample</title>
      </head>
      <body>
        <div className="container">
          <div className="masthead">
            <ul className="nav nav-pills pull-right">
              <li className="active"><a href="/">Home</a></li>
              <li className=""><a href="/react">React</a></li>
              <li className=""><a href="/redux">Redux</a></li>
              <li className=""><a href="/about">About</a></li>
              <li className=""><a href="/login">Login</a></li>
            </ul>
            <h3 className="muted">Sample</h3>
          </div>
          <hr />
            <div id="app">{props.children}</div>
          <hr />
          <div id="footer">&copy; Lunascape Corporation</div>
          <script id="initial-data" type="text/plain" data-json={props.initialData}></script>
          <script id="initial-config" type="text/plain" data-json={props.initialConfig}></script>
          <script type="text/javascript" charSet="utf-8" src="/js/test.js?ver=1"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js"
            integrity="sha384-cs/chFZiN24E4KMATLdqdvsezGxaGsi4hLGOzlXwp5UZB1LY//20VyM2taTB4QvJ"
            crossOrigin="anonymous"></script>
          <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js"
            integrity="sha384-uefMccjFJAIv6A+rW+L4AHf99KvxDjWSu1z9VI8SKNVmz4sk7buKt/6v9KI65qnm"
            crossOrigin="anonymous"></script>
          </div>
      </body>
    </html>
  );
};
