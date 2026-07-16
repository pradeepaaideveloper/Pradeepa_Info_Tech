from datetime import date, datetime
from sqlalchemy import String, Integer, Decimal, Date, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..database import Base

class Student(Base):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    father_name: Mapped[str] = mapped_column(String(100), nullable=True)
    dob: Mapped[date] = mapped_column(Date, nullable=True)
    gender: Mapped[str] = mapped_column(String(10), nullable=True)
    address: Mapped[str] = mapped_column(String(255), nullable=True)
    qualification: Mapped[str] = mapped_column(String(50), nullable=True)
    registration_no: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    photo_url: Mapped[str] = mapped_column(String(255), nullable=True)
    id_card_url: Mapped[str] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="active", nullable=False) # active, completed, discontinued

    # Relationships
    user = relationship("User", back_populates="student_profile")
    enrollments = relationship("StudentCourse", back_populates="student", cascade="all, delete-orphan")
    attendance_records = relationship("Attendance", back_populates="student", cascade="all, delete-orphan")


class StudentCourse(Base):
    __tablename__ = "student_courses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    student_id: Mapped[int] = mapped_column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    course_id: Mapped[int] = mapped_column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    enrollment_date: Mapped[date] = mapped_column(Date, default=date.today, nullable=False)
    total_course_fee: Mapped[float] = mapped_column(Decimal(10, 2), nullable=False)
    amount_paid: Mapped[float] = mapped_column(Decimal(10, 2), default=0.0, nullable=False)
    payment_status: Mapped[str] = mapped_column(String(20), default="pending", nullable=False) # pending, partially_paid, fully_paid
    status: Mapped[str] = mapped_column(String(20), default="enrolled", nullable=False) # enrolled, ongoing, completed

    # Relationships
    student = relationship("Student", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")
    fees = relationship("Fee", back_populates="student_course", cascade="all, delete-orphan")
    certificate = relationship("Certificate", back_populates="student_course", uselist=False, cascade="all, delete-orphan")


class Attendance(Base):
    __tablename__ = "attendance"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    student_id: Mapped[int] = mapped_column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    date: Mapped[date] = mapped_column(Date, default=date.today, nullable=False)
    status: Mapped[str] = mapped_column(String(10), nullable=False) # present, absent, late
    remarks: Mapped[str] = mapped_column(String(255), nullable=True)

    # Relationships
    student = relationship("Student", back_populates="attendance_records")


class Fee(Base):
    __tablename__ = "fees"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    student_course_id: Mapped[int] = mapped_column(Integer, ForeignKey("student_courses.id", ondelete="CASCADE"), nullable=False)
    amount_paid: Mapped[float] = mapped_column(Decimal(10, 2), nullable=False)
    payment_date: Mapped[date] = mapped_column(Date, default=date.today, nullable=False)
    payment_method: Mapped[str] = mapped_column(String(20), nullable=False) # upi, cash, card, netbanking
    transaction_ref: Mapped[str] = mapped_column(String(100), nullable=True)
    receipt_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    cgst: Mapped[float] = mapped_column(Decimal(10, 2), default=0.0, nullable=False)
    sgst: Mapped[float] = mapped_column(Decimal(10, 2), default=0.0, nullable=False)
    receipt_url: Mapped[str] = mapped_column(String(255), nullable=True)

    # Relationships
    student_course = relationship("StudentCourse", back_populates="fees")


class Certificate(Base):
    __tablename__ = "certificates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    student_course_id: Mapped[int] = mapped_column(Integer, ForeignKey("student_courses.id", ondelete="CASCADE"), nullable=False)
    certificate_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    issue_date: Mapped[date] = mapped_column(Date, default=date.today, nullable=False)
    verification_code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    certificate_url: Mapped[str] = mapped_column(String(255), nullable=True)

    # Relationships
    student_course = relationship("StudentCourse", back_populates="certificate")
