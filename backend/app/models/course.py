from sqlalchemy import String, Integer, Decimal, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..database import Base

class Course(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    title_ta: Mapped[str] = mapped_column(String(100), nullable=True) # Tamil title
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    description_ta: Mapped[str] = mapped_column(Text, nullable=True) # Tamil description
    price: Mapped[float] = mapped_column(Decimal(10, 2), nullable=False)
    duration_months: Mapped[int] = mapped_column(Integer, nullable=False)
    syllabus: Mapped[str] = mapped_column(Text, nullable=True) # Stored as JSON string
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    image_url: Mapped[str] = mapped_column(String(255), nullable=True)

    # Relationships
    enrollments = relationship("StudentCourse", back_populates="course")
    reviews = relationship("Review", back_populates="course")
