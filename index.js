import restify from 'restify'
import CloudWatch from 'aws-sdk/clients/cloudwatch'
import request from 'request'

const server = restify.createServer()
server.use(restify.plugins.bodyParser())
const cloudwatch = new CloudWatch({
  region: 'eu-west-1',
})

server.get('/rum/test', (req, res, next) => {
  const params = {
    MetricData: [
      {
        MetricName: 'HELLO_WORLD',
        Value: 100,
      }
    ],
    Namespace: 'KissKissBankBank/RUM',
  }

  request.put({
    url: 'http://localhost:8080/rum/create-entry',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  }, (error, response, body) => {
    console.log('error:', error)
    console.log('statusCode:', response && response.statusCode)
    res.send(body)
  })

  next()
})

server.put('/rum/create-entry', (req, res, next) => {
  cloudwatch.putMetricData(req.body, (err, data) => {
    if (err) {
      return console.log(err, err.stack)
    }

    res.send(data)
  })

  next()
})

server.listen(8080, () => {
  console.log('%s listening at %s', server.name, server.url)
})
