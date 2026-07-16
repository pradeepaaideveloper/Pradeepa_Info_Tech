from sqlalchemy import String, Integer, Decimal, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..database import Base

class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    barcode: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    name_ta: Mapped[str] = mapped_column(String(100), nullable=True) # Tamil name
    description: Mapped[str] = mapped_column(Text, nullable=True)
    description_ta: Mapped[str] = mapped_column(Text, nullable=True) # Tamil description
    category: Mapped[str] = mapped_column(String(50), nullable=False) # stationery, accessories, electronics
    
    # Financials & Inventory
    purchase_price: Mapped[float] = mapped_column(Decimal(10, 2), nullable=False)
    selling_price: Mapped[float] = mapped_column(Decimal(10, 2), nullable=False)
    margin_percent: Mapped[float] = mapped_column(Decimal(5, 2), nullable=False)
    gst_rate: Mapped[float] = mapped_column(Decimal(5, 2), default=0.18, nullable=False) # e.g. 0.18
    stock_quantity: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    min_stock_level: Mapped[int] = mapped_column(Integer, default=5, nullable=False) # Low stock alert trigger level
    
    # Supplier details
    supplier_name: Mapped[str] = mapped_column(String(100), nullable=True)
    supplier_contact: Mapped[str] = mapped_column(String(50), nullable=True)
    
    image_url: Mapped[str] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    cart_items = relationship("CartItem", back_populates="product", cascade="all, delete-orphan")
    wishlist_items = relationship("Wishlist", back_populates="product", cascade="all, delete-orphan")
    order_items = relationship("OrderItem", back_populates="product")
    pos_items = relationship("POSBillItem", back_populates="product")
    reviews = relationship("Review", back_populates="product")
