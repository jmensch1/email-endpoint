### What
Instantly create an endpoint that you can use to POST emails to yourself.

### How
By automatically creating the necessary resources in your AWS account -- a lambda function, API gateway, and IAM role. The heavy lifting is done by [ClaudiaJS](https://claudiajs.com/). Emails are sent through [sendgrid](https://sendgrid.com/).

### Why
As a dev there are numerous situations in which it would be convenient to email yourself from code. You could set up a server for that -- but that takes too long and requires maintenance time and expenses. You could set up your own lambda function/API gateway combination, but that configuration process is a nightmare. Services like Mailgun are a step in the right direction, but you still need to send an API key with every email (not great for frontend code), and those services often require a credit card to get started, which is just annoying.

### Requirements
1. An AWS account with access to IAM, Lambda and API Gateway.
2. A Sendgrid API key. The free tier gets you 100 emails per day, with no credit card required.

### Installation
```
npm install -g email-endpoint
```

### Basic Usage
To create an endpoint, run the `create` command.
```
>> email-endpoint create \
  --name endpoint1 \                    (required, can be any alphanumeric string)
  --email myemail@whatever.com \        (required, any valid email)
  --apiKey xxxxxxxxxxxxxxxxxxx \        (required, your sendgrid api key)
  --region us-east-1                    (optional, defaults to us-east-1)
```

The command will generate an endpoint and output the url.

```
ENDPOINT: https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/latest
```

Once you have the endpoint, you can send emails by POSTing the subject and text of the email. For example, you can email yourself using `curl`:

```
>> curl \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{"subject":"hiya bud", "text":"the endpoint works!"}' \
  https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/latest
```

Or from your Node script.
```
request({
  url: https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/latest,
  method: 'post',
  body: {
    subject: 'The server restarted',
    text: 'Check the logs'
  },
  json: true
});
```

Or via HTML form.
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
    subject: 'Hi there',
    text: 'have an email'
  }
});
```

### Other commands

##### List your endpoints
```
>> email-endpoint list
```

##### Test an endpoint
```
>> email-endpoint test --name [endpoint name]
```

##### Destroy an endpoint
```
>> email-endpoint destroy --name [endpoint name]
```
