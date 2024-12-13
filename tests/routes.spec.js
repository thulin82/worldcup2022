/* eslint-disable no-undef */
import { use } from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";

const chai = use(chaiHttp);
const expect = chai.expect;

describe("World Cup 2022 Routes", () => {
    describe("GET /", () => {
        it("should return html", (done) => {
            chai.request
                .execute(app)
                .get("/")
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.type).to.eql("text/html");
                    done();
                });
        });
    });
    describe("GET /standings", () => {
        it("should return html", (done) => {
            chai.request
                .execute(app)
                .get("/standings")
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.type).to.eql("text/html");
                    done();
                });
        });
    });
    describe("GET /scorers", () => {
        it("should return html", (done) => {
            chai.request
                .execute(app)
                .get("/scorers")
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.type).to.eql("text/html");
                    done();
                });
        });
    });
    describe("GET /playoff", () => {
        it("should return html", (done) => {
            chai.request
                .execute(app)
                .get("/playoff")
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.type).to.eql("text/html");
                    done();
                });
        });
    });
});
