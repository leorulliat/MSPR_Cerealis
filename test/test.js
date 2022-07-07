import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js';

chai.should();

chai.use(chaiHttp);

describe('API CEREALIS', () => {

    /**
     * DELETE/all
     * on commence par supprimer tous les utilisateurs
     * expected : 
     *  statut = 200 (OK)
     *  type = string
     *  text = "DB CLEAR" 
     */
    describe('DELETE /all', () => {
        it("It should DELETE all existing users", (done) => {
            chai.request(app)
                .delete("/all")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.text.should.be.a('string');
                    response.text.should.have.eq('DB CLEAR');
                    done();
                });
        });
    });

    /**
     * POST/registerUser
     * on ajoute un utilisateur :
     * {
     *    email: "andres.boulanger@epsi.fr",
     *    firstName: "Andres",
     *    lastName: "Boulanger"
     * }
     * expected : 
     *  statut = 201 (created)
     *  type = string
     *  text = "Enregistré" 
     */
    describe('POST /registerUser', () => {
        it('It should POST a new user and get the message : "Enregistré"', (done) => {
            const user = {
                email: "andres.boulanger@epsi.fr",
                firstName: "Andres",
                lastName: "Boulanger"
            };
            chai.request(app)
                .post("/registerUser")
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.text.should.be.a('string');
                    response.text.should.be.eq('Enregistré');
                    done();
                });
        });
    });

    /**
     * GET/getCount
     * on vérifie que le nb d'utilisateurs soit à 1
     * expected : 
     *  statut = 200 (OK)
     *  type = object 
     *  value = { count : 1 }
     */
    describe('GET /getCount', () => {
        it("It should GET the number of users (1)", (done) => {
            chai.request(app)
                .get("/getCount")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('count');
                    response.body.should.have.property('count').a('number');
                    response.body.should.have.property('count').eq(1);
                    done();
                });
        });
    });

    /**
     * GET/getAll
     * On récupère tous les utilisateurs
     * expected : 
     *  statut = 200 (OK)
     *  type = array
     *  length = 1
     */
    describe('GET /getAll', () => {
        it("It should GET all users (array of 1 user)", (done) => {
            chai.request(app)
                .get("/getAll")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    response.body.should.be.a('array').length(1);
                    done();
                });
        });
    });

    /**
     * POST/registerUser
     * on ajoute un utilisateur :
     * {
     *    email: "andres.boulanger@epsi.fr",
     *    firstName: "Andres",
     *    lastName: "Boulanger"
     * }
     * expected : 
     *  statut = 200 (OK)
     *  type = string
     *  text = "Déjà enregistré" 
     */
    describe('POST /registerUser', () => {
        it('It should try to POST a the same user and get the message : "Déjà enregistré"', (done) => {
            const user = {
                email: "andres.boulanger@epsi.fr",
                firstName: "Andres",
                lastName: "Boulanger"
            };
            chai.request(app)
                .post("/registerUser")
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.text.should.be.a('string');
                    response.text.should.be.eq('Déjà enregistré');
                    done();
                });
        });
    });

    /**
     * DELETE/all
     * on termine par supprimer l'utilisateur
     * expected : 
     *  statut = 200
     *  type = string
     *  text = "DB CLEAR" 
     */
    describe('DELETE /all', () => {
        it("It should DELETE the user", (done) => {
            chai.request(app)
                .delete("/all")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.text.should.be.a('string');
                    response.text.should.have.eq('DB CLEAR');
                    done();
                });
        });
    });  

    /**
     * GET/getCount
     * on vérifie que le nb d'utilisateurs à 0
     * expected : 
     *  statut = 200 (OK)
     *  type = object 
     *  value = { count : 0 }
     */
    describe('GET /getCount', () => {
        it("It should GET Zero user", (done) => {
            chai.request(app)
                .get("/getCount")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('count');
                    response.body.should.have.property('count').a('number');
                    response.body.should.have.property('count').eq(0);
                    done();
                });
        });
    });
});