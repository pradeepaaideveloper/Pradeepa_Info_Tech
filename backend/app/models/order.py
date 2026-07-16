from datetime import datetime
from sqlalchemy import String, Integer, Decimal, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..database import Base

class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    coupon_id: Mapped[int] = mapped_column(Integer, ForeignKey("coupons.id", ondelete="SET NULL"), nullable=True)
    order_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    
    # Financial breakdown
    subtotal: Mapped[float] = mapped_column(Decimal(10, 2), nullable=False)
    discount: Mapped[float] = mapped_column(Decimal(10, 2), default=0.0, nullable=False)
    gst_total: Mapped[float] = mapped_column(Decimal(10, 2), nullable=False)
    total_amount: Mapped[float] = mapped_column(Decimal(10, 2), nullable=False)
    
    # Statuses
    payment_status: Mapped[str] = mapped_column(String(20), default="pending", nullable=False) # pending, paid, failed, refunded
    payment_method: Mapped[str] = mapped_column(String(20), nullable=True) # upi, card, netbanking, cash
    razorpay_order_id: Mapped[str] = mapped_column(String(100), nullable=True)
    razorpay_payment_id: Mapped[str] = mapped_column(String(100), nullable=True)
    
    shipping_address: Mapped[str] = mapped_column(Text, nullable=False)
    order_status: Mapped[str] = mapped_column(String(25), default="placed", nullable=False) # placed, processing, shipped, delivered, cancelled
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="orders")
    coupon = relationship("Coupon", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("products.id", ondelete="RESTRICT"), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    
    unit_price: Mapped[float] = mapped_column(Decimal(10, 2), nullable=False)
    gst_rate: Mapped[float] = mapped_column(Decimal(5, 2), nullable=False) # e.g. 0.18
    gst_amount: Mapped[float] = mapped_column(Decimal(10, 2), nullable=False)

    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
