package com.__105.Banchan.util;

public class GenerateRandomPassword {
    public static String createRandomPassword() {
        String passwordSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
        char[] password = new char[15];
        for (int i = 0; i < 15; i++) {
            int random = (int) (Math.random() * passwordSet.length());
            password[i] = passwordSet.charAt(random);
        }
        return new String(password);
    }
}
