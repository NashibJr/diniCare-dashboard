import Api from "..";
import {
  Category,
  Coupon,
  DeleteUpdateResponse,
  GeneralCreate,
  GeneralQuery,
  IUser,
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

  public updateProduct = async (
    id: string,
    data: unknown,
  ): Promise<DeleteUpdateResponse> =>
    await this.api.patch(`/products/update/${id}`, data);

  public getCategories = async (): Promise<Category[]> =>
    await this.api.get("/products/category/get");

  public createProduct = async (
    data: FormData,
  ): Promise<GeneralCreate<Product>> =>
    await this.api.post("/products/create", data);

  public createCategory = async (
    data: unknown,
  ): Promise<GeneralCreate<Category>> =>
    await this.api.post("/products/category/create", data);

  public updateCategory = async (
    data: unknown,
    id: string,
  ): Promise<DeleteUpdateResponse> =>
    await this.api.post(`/products/category/update/${id}`, data);

  public getCustomers = async (
    page: number = 1,
    limit: number = 100,
  ): Promise<GeneralQuery<IUser>> =>
    await this.api.get(
      `/accounts/all?accType=user&limit=${limit}&page=${page}`,
    );

  public getCustomerDetails = async (id: string): Promise<IUser> =>
    await this.api.get(`/accounts/details/${id}`);

  public getCustomerOrders = async (
    page: number = 1,
    limit = 100,
    customerId: string,
  ): Promise<GeneralQuery<Order>> =>
    await this.api.get(
      `/orders/get?page=${page}&limit=${limit}&customer=${customerId}`,
    );

  public getCoupons = async (
    page: number = 1,
    limit: number = 100,
  ): Promise<GeneralQuery<Coupon>> =>
    await this.api.get(`/trcs/coupon/all?limit=${limit}&page=${page}`);
}

const actions = new Actions();

export default actions;
