import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@tm-tickets-1989/common";

export { OrderStatus };

interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
  isPending(): boolean;
}

interface CustomFindArgs {
  id: string;
  version: number;
}
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
  findByEvent(args: CustomFindArgs): Promise<OrderDoc | null>;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  const { id: _id } = attrs;
  return new Order({ ...attrs, _id, id: undefined });
};

orderSchema.statics.findByEvent = async ({ id, version }: CustomFindArgs) => {
  return Order.findOne({
    _id: id,
    version: version - 1,
  });
};

orderSchema.methods.isPending = function () {
  return this.status !== OrderStatus.Cancelled;
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
