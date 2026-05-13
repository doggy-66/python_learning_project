#!/usr/bin/env python3
"""数学运算工具 - 支持加减乘除及复杂计算测试"""


def add(a, b):
    """加法"""
    return a + b


def subtract(a, b):
    """减法"""
    return a - b


def multiply(a, b):
    """乘法"""
    return a * b


def divide(a, b):
    """除法（除零抛出异常）"""
    if b == 0:
        raise ValueError("除数不能为零")
    return a / b


def power(a, b):
    """乘方"""
    return a ** b


def mod(a, b):
    """取余（除零抛出异常）"""
    if b == 0:
        raise ValueError("除数不能为零")
    return a % b


def integer_divide(a, b):
    """整除（除零抛出异常）"""
    if b == 0:
        raise ValueError("除数不能为零")
    return a // b


def main():
    """复杂计算测试"""
    print("=" * 50)
    print("加减乘除 & 复杂计算测试")
    print("=" * 50)

    # 基本运算测试
    print("\n【基本运算】")
    print(f"  123 + 456 = {add(123, 456)}")
    print(f"  1000 - 234 = {subtract(1000, 234)}")
    print(f"  25 × 68 = {multiply(25, 68)}")
    print(f"  100 ÷ 3 = {divide(100, 3):.4f}")
    print(f"  2^10 = {power(2, 10)}")
    print(f"  100 % 7 = {mod(100, 7)}")
    print(f"  100 // 3 = {integer_divide(100, 3)}")

    # 复合运算测试
    print("\n【复合运算】")

    # 计算: (123 + 456) × (1000 - 234) ÷ 100
    result1 = divide(multiply(add(123, 456), subtract(1000, 234)), 100)
    print(f"  (123 + 456) × (1000 - 234) ÷ 100 = {result1:.2f}")

    # 计算: (2^10 + 3^5) × (50 - 20) ÷ 7
    result2 = divide(multiply(add(power(2, 10), power(3, 5)), subtract(50, 20)), 7)
    print(f"  (2^10 + 3^5) × (50 - 20) ÷ 7 = {result2:.2f}")

    # 计算: √((a² + b²)) ≈ pow(a² + b², 0.5)
    a, b = 3, 4
    c_squared = add(power(a, 2), power(b, 2))
    hypotenuse = power(c_squared, 0.5)
    print(f"  直角三角形 a={a}, b={b} → 斜边 c = √({a}² + {b}²) = {hypotenuse}")

    # 计算: 圆面积 π × r²
    r = 5
    pi = 3.141592653589793
    circle_area = multiply(pi, power(r, 2))
    print(f"  圆半径 r={r} → 面积 = π × r² = {circle_area:.4f}")

    # 计算: 求根公式 ax² + bx + c = 0
    a, b_val, c = 1, -3, 2  # x² - 3x + 2 = 0 → x=1, x=2
    discriminant = subtract(power(b_val, 2), multiply(multiply(4, a), c))
    print(f"  方程 x² - 3x + 2 = 0 → 判别式 = {discriminant}")
    if discriminant >= 0:
        sqrt_d = power(discriminant, 0.5)
        x1 = divide(add(subtract(0, b_val), sqrt_d), multiply(2, a))
        x2 = divide(subtract(subtract(0, b_val), sqrt_d), multiply(2, a))
        print(f"  根: x₁ = {x1}, x₂ = {x2}")

    # 测试除零保护
    print("\n【除零保护测试】")
    try:
        divide(10, 0)
    except ValueError as e:
        print(f"  10 ÷ 0 触发异常: {e}")

    try:
        integer_divide(10, 0)
    except ValueError as e:
        print(f"  10 // 0 触发异常: {e}")

    print("\n" + "=" * 50)
    print("测试完成！")
    print("=" * 50)


if __name__ == "__main__":
    main()
