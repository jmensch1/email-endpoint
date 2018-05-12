### What
Instantly create an endpoint that you can use to POST emails to yourself.

### How
The package automatically creates the necessary resources in your AWS account -- a lambda function, API gateway, and IAM role. The heavy lifting is done by [ClaudiaJS](https://claudiajs.com/). Emails are sent through [Sendgrid](https://sendgrid.com/).

### Why
As a dev there are numerous situations in which it would be convenient to email yourself from code. You could set up a server for that -- but that takes too long and requires maintenance time and expenses. You could set up your own lambda function/API gateway combination, but that configuration process is a nightmare. Services like Mailgun are a step in the right direction, but you still need to send an API key with every email (not great for frontend code), and those services often require a credit card to get started, which is just annoying.

### Requirements
1. An AWS account with access to IAM, Lambda and API Gateway.
2. A Sendgrid API key. The free tier gets you 100 emails per day, with no credit card required.

### Installation
```
npm install -g email-endpoint
```

### Commands

#### `email-endpoint create`
Creates an endpoint and outputs the url. In order to create the endpoint, you will be prompted for the following:

  1. name -- a handle for the endpoint, e.g. the name of the app you're working on.
  2. email -- the email you want to send to.
  3. apiKey -- the Sendgrid api key you want to use.
  4. region -- the AWS region you want to create the resources in. Defaults to `us-east-1`.

You can create as many endpoints as you want, using different emails/apiKeys/regions as appropriate. Each endpoint must have a unique name.

#### `email-endpoint list`
Lists the endpoints you have created.

#### `email-endpoint test [endpoint name]`
Sends a test email to the named endpoint.

#### `email-endpoint destroy [endpoint name]`
Destroys the named endpoint, removing the endpoint's resources on AWS.

#### `email-endpoint help`
Displays the available commands.

### Usage

Once you have an endpoint, you can send emails by POSTing the subject and text of the email to the endpoint's url. For example, you can email yourself using `curl`:

```
>> curl \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{"subject":"hiya bud", "text": "the endpoint works!"}' \
  https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/latest
```

Or from your Node script.
```
request({
  url: 'https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/latest',
  method: 'post',
  body: {
    subject: 'The server restarted',
    text: 'Check the logs'
  },
  json: true
});
```

Or on the client side, via HTML form.
```
<h3>Admin Contact Form</h3>
<form method="POST" action="https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/latest">
  Subject: <input type="text" name="subject"><br>
  Text: <input type="text" name="text"><br>
  <input type="submit" value="Submit">
</form>
```

Or ajax.
```
$.ajax({
  url: 'https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/latest',
  method: 'POST',
  data: {
    subject: 'Error!',
    text: error.stack
  }
});
```

If the email doesn't maintain line breaks, or you want to use HTML tags in the email for whatever reason, just send the email with an `html` property instead of `text`:
```
request({
  url: 'https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/latest',
  method: 'post',
  body: {
    subject: 'HTML email',
    html: text.replace(/\n/g, '<br/>')
  },
  json: true
});
```

### Notes

On installation, the package will create a folder called `.npm-email-endpoint` in your home directory to store data about your endpoints. This allows the package to continue working even if you upgrade or reinstall Node (or change Node versions using `nvm`). If you change machines, you can copy that folder into your home directory on the new machine, and the package will take data from that folder instead of creating a new one.

Also, your sendgrid API key will be stored in plain text in the `.npm-email-endpoint` folder. If that's a problem...well, don't use the package.
