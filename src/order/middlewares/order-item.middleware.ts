import { NextFunction, Request, Response } from "express";
import { validate } from "class-validator";
import { HttpResponse } from "../../shared/response/http.response";

export class OrderItemMiddleware {
  constructor(
    private readonly httpResponse: HttpResponse = new HttpResponse()
  ) {}
}
