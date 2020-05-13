class User{
    String name;
    int age;

    User(String name, int age) {
        this.name = name;
        this.age = age;
    }

    void show() {
        print(name);
        print(age);
    }
}

main() {
    var user = new User('zhangsan', 20);
    user.show();
}