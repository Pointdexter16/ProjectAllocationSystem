import bcrypt

def hash_password(password: str) -> str:
    """
    Hashes a plain-text password using bcrypt.

    Args:
        password: The plain-text password string.

    Returns:
        The hashed password string, encoded for storage.
    """
    # The password must be encoded to bytes before hashing.
    password_bytes = password.encode('utf-8')
    # Generate a salt and hash the password in one step.
    # bcrypt.gensalt() handles generating a strong salt.
    hashed_bytes = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    # The result is a byte string; decode it back to a string for storage.
    return hashed_bytes.decode('utf-8')

def check_password(password: str, hashed_password: str) -> bool:
    """
    Checks if a plain-text password matches a stored hashed password.

    Args:
        password: The plain-text password string to check.
        hashed_password: The stored hashed password string.

    Returns:
        True if the passwords match, False otherwise.
    """
    # Both the plain password and the stored hash must be encoded to bytes for comparison.
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))