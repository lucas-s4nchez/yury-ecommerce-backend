import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  constructor(private readonly userService: UserService = new UserService()) {}

  async getUser(req: Request, res: Response) {
    try {
      const data = await this.userService.findAllUsers();
      res.status(200).json(data);
    } catch (e) {
      console.log(e);
    }
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data = await this.userService.findUserById(id);
      res.status(200).json(data);
    } catch (e) {
      console.log(e);
    }
  }

  async createUser(req: Request, res: Response) {
    const userData = req.body;
    try {
      const data = await this.userService.createUser(userData);
      res.status(200).json(data);
    } catch (e) {
      console.log(e);
    }
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const userData = req.body;
    try {
      const data = await this.userService.updateUser(id, userData);
      res.status(200).json(data);
    } catch (e) {
      console.log(e);
    }
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data = await this.userService.deleteUser(id);
      res.status(200).json(data);
    } catch (e) {
      console.log(e);
    }
  }
}
