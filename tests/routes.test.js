const request = require('supertest')
const server = require('../server/server')
describe('Get Endpoints', () => {
  it('should request /api/', async () => {
    const res = await request(server)
      .get('/api/')
    expect(res.statusCode).toEqual(200)
  })
  it('should request /producer/', async () => {
    const res = await request(server)
      .get('/producer/')
    expect(res.statusCode).toEqual(200)
    expect(res.body.active).toEqual(false)
    expect(res.body.logging).toEqual(true)
  })
})
describe('Post Endpoints', () => {
    it('should post /producer/', async () => {
    const res = await request(server)
        .post('/producer/')
        .send({
            active: false,
            logging: false
          })
    expect(res.statusCode).toEqual(200)
    })
    it('should request /producer/', async () => {
        const res = await request(server)
          .get('/producer/')
        expect(res.statusCode).toEqual(200)
        expect(res.body.active).toEqual(false)
        expect(res.body.logging).toEqual(false)
      }) 
  })
