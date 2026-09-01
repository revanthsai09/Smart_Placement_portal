INSERT IGNORE INTO users (name, email, password, role, is_active, created_at)
VALUES ('Super Admin', 'admin@portal.com',
        '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8ioctHPESRhJjqVpZ8RJ7dOGe4FdO',
        'ADMIN', true, NOW());
