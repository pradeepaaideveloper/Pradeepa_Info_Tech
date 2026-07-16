from datetime import datetime
from sqlalchemy import String, Integer, Decimal, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..database import Base

class POSBill(Base):
    __tablename__ = "pos_bills"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    cashier_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    coupon_id: Mapped[int] = mapped_column(Integer, ForeignKey("coupons.id", ondelete="SET NULL"), nullable=True)
    bill_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    
    # Financial details
    subtotal: Mapped[float] = mapped_column(Decimal(10, 2), nullable=False)
    discount: Mapped[float] = mapped_column(Decimal(10, 2), default=0.0, nullable=False)
    gst_total: Mapped[float] = mapped_column(Decimal(10, 2), nullable=False)
    total_amount: Mapped[float] = mapped_column(Decimal(10, 2), nullable=False)
    
    payment_method: Mapped[str] = mapped_column(String(20), nullable=False) # cash, upi, card
    
    # Customer reference info
    customer_name: Mapped[str] = mapped_column(String(100), nullable=True)
    customer_phone: Mapped[str] = mapped_column(String(20), nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    cashier = relationship("User", back_populates="pos_bills")
    coupon = relationship("Coupon", back_populates="pos_bills")
    items = relationship("POSBillItem", back_populates="pos_bill", cascade="all, delete-orphan")


class POSBillItem(Base):
    __tablename__ = "pos_bill_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    pos_bill_id: Mapped[int] = mapped_column(Integer, ForeignKey("pos_bills.id", ondelete="CASCADE"), nullable=False)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("products.id", ondelete="RESTRICT"), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    
    unit_price: Mapped[float] = mapped_column(Decimal(10, 2), nullable=False)
    gst_rate: Mapped[float] = mapped_column(Decimal(5, 2), nullable=False) # e.g. 0.18
    gst_amount: Mapped[float] = mapped_column(Decimal(10, 2), nullable=False)

    # Relationships
    pos_bill = relationship("POSBill", back_populates="items")
    product = relationship("Product", back_populates="pos_items")
