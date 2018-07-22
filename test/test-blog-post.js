const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

//const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);


describe('BlogPost', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should list blog-posts on GET', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {

        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');

        res.body.should.have.length.of.at.least(1);
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys('id', 'title', 'content','author','publishedDate');
        });
      });
  });

  // // id: uuid.v4(),
  // title: title,
  // content: content,
  // author: author,
  // publishDate: publishDate || Date.now()
  it('should add a blog-post on POST', function() {
    const newBlogPost = {
        title: 'New blog-post', content: 'New blog post content', author:'John Doe', publishedDate: publishDate || Date.now()};
    return chai.request(app)
      .post('/blog-posts')
      .send(newBlogPost)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('id', 'title', 'content','author','publishedDate');
        res.body.title.should.equal(newBlogPost.title);
        res.body.content.should.be.a('string'); //changed from an array to a string
        res.body.author.should.include.members(newBlogPost.author);
        res.body.publishDate.should.equal(newBlogPost.publishedDate);// added this
      });
  });

  it('should update blog-post on PUT', function() {

    const updateData = {
      title: 'foobar',
      content: 'interesting stuff'
    };

    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        updateData.id = res.body[0].id;

        return chai.request(app)
          .put(`/blog-posts/${updateData.id}`)
          .send(updateData)
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });

  it('should delete blog-post on DELETE', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog-posts/${res.body[0].id}`)
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });
}); 