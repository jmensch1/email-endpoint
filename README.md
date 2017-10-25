
Instantly create an endpoint that send emails to a specified address.

### Prerequesites

1. An AWS account with access to IAM, Lambda and API Gateway.
2. A Sendgrid API key. The free tier gets you 100 emails per day.

### Installation

```
npm install -g email-endpoint
```

### Basic Usage

To create an endpoint, run this command.

```
>> email-endpoint create \
  --name endpoint1 \
  --email myemail@whatever.com \
  --apiKey xxxxxxxxxxxxxxxxxxx \
  --region us-east-1
```

The name, email and (sendgrid) apiKey params are required. Name can be any alphanumeric string. Region refers to the AWS region where the lambda function and API gateway will be created. The region parameter is optional, and defaults to us-east-1.

The command will output the AWS invoke url for the API gateway --

```
ENDPOINT: https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/latest

```

Once you have the endpoint, you can `curl` yourself an email --

```
curl \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{"subject":"hiya bud", "text":"the endpoint works!"}' \
  https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/latest

```

Or form yourself an email --

```
```

Or ajax yourself an email --

```
```

### Other commands

List your endpoints: `email-endpoint list`

Send a test email: `email-endpoint test --name [endpoint name]`

Destroy an endpoint: `email-endpoint destroy --name [endpoint name]`



