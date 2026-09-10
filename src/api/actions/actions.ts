import Api from "..";
import {
  DeleteUpdateResponse,
  GeneralQuery,
  LoginResponse,
  Order,
  Product,
} from "../../response.type";

class Actions {
  private api: Api;

  constructor() {
    this.api = new Api();
  }

  public login = async (data: unknown): Promise<LoginResponse> =>
    await this.api.post("/accounts/auth", data);

  public getOrders = async (
    page: number = 1,
    limit = 100,
  ): Promise<GeneralQuery<Order>> =>
    await this.api.get(`/orders/get?page=${page}&limit=${limit}`);

  public getOrderDetails = async (orderId: string): Promise<Order> =>
    await this.api.get(`/orders/details/${orderId}`);

  public getProducts = async (
    page: number = 1,
    limit: number = 100,
  ): Promise<GeneralQuery<Product>> =>
    await this.api.get(`/products/all?limit=${limit}&page=${page}`);

  public deleteProduct = async (id: string): Promise<DeleteUpdateResponse> =>
    await this.api.delete(`/products/delete/${id}`);
}

const actions = new Actions();

export default actions;
