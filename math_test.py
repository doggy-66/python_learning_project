#!/usr/bin/env python3
"""数学运算工具 - 支持加减乘除及复杂计算测试"""


def _check_divisor(b: float) -> None:
    """检查除数是否为零，为零则抛出 ValueError"""
    if b == 0:
        raise ValueError("除数不能为零")


def add(a: float, b: float) -> float:
    """加法"""
    return a + b


def subtract(a: float, b: float) -> float:
    """减法"""
    return a - b


def multiply(a: float, b: float) -> float:
    """乘法"""
    return a * b


def divide(a: float, b: float) -> float:
    """除法（除零抛出异常）"""
    _check_divisor(b)
    return a / b


def power(a: float, b: float) -> float:
    """乘方"""
    return a ** b


def mod(a: float, b: float) -> float:
    """取余（除零抛出异常）"""
    _check_divisor(b)
    return a % b


def integer_divide(a: float, b: float) -> float:
    """整除（除零抛出异常）"""
    _check_divisor(b)
    return a // b


def test_basic():
    """基本运算测试"""
    print("\n【基本运算】")
    print(f"  123 + 456 = {add(123, 456)}")
    print(f"  1000 - 234 = {subtract(1000, 234)}")
    print(f"  25 × 68 = {multiply(25, 68)}")
    print(f"  100 ÷ 3 = {divide(100, 3):.4f}")
    print(f"  2^10 = {power(2, 10)}")
    print(f"  100 % 7 = {mod(100, 7)}")
    print(f"  100 // 3 = {integer_divide(100, 3)}")


def test_compound():
    """复合运算测试"""
    print("\n【复合运算】")

    result1 = divide(multiply(add(123, 456), subtract(1000, 234)), 100)
    print(f"  (123 + 456) × (1000 - 234) ÷ 100 = {result1:.2f}")

    result2 = divide(multiply(add(power(2, 10), power(3, 5)), subtract(50, 20)), 7)
    print(f"  (2^10 + 3^5) × (50 - 20) ÷ 7 = {result2:.2f}")

    a, b = 3, 4
    c_squared = add(power(a, 2), power(b, 2))
    hypotenuse = power(c_squared, 0.5)
    print(f"  直角三角形 a={a}, b={b} → 斜边 c = √({a}² + {b}²) = {hypotenuse}")

    r = 5
    pi = 3.141592653589793
    circle_area = multiply(pi, power(r, 2))
    print(f"  圆半径 r={r} → 面积 = π × r² = {circle_area:.4f}")

    a, b_coef, c = 1, -3, 2
    discriminant = subtract(power(b_coef, 2), multiply(multiply(4, a), c))
    print(f"  方程 x² - 3x + 2 = 0 → 判别式 = {discriminant}")
    if discriminant >= 0:
        sqrt_d = power(discriminant, 0.5)
        x1 = divide(-b_coef + sqrt_d, multiply(2, a))
        x2 = divide(-b_coef - sqrt_d, multiply(2, a))
        print(f"  根: x₁ = {x1}, x₂ = {x2}")


def test_divide_by_zero():
    """除零保护测试"""
    print("\n【除零保护测试】")
    try:
        divide(10, 0)
    except ValueError as e:
        print(f"  10 ÷ 0 触发异常: {e}")

    try:
        integer_divide(10, 0)
    except ValueError as e:
        print(f"  10 // 0 触发异常: {e}")


def main():
    """复杂计算测试"""
    print("=" * 50)
    print("加减乘除 & 复杂计算测试")
    print("=" * 50)

    test_basic()
    test_compound()
    test_divide_by_zero()

    print("\n" + "=" * 50)
    print("测试完成！")
    print("=" * 50)


if __name__ == "__main__":
    main()
