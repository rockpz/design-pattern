#include <sys/ucontext.h>
#include <stdio.h>

void foo(void *arg)
{
    puts("1");
    puts("11");
    puts("111");
    puts("1111");
}

void context_test()
{
    char stack[1024 * 128];
    ucontext_t child, father;

    getcontext(&child);
    child.uc_stack.ss_sp = stack;
    child.uc_stack.ss_size = sizeof(stack);
    child.uc_stack.ss_flags = 0;
    child.uc_link = &father;

    makecontext(&child, (void (*) (void))foo, 0);

    swapcontext(&father, &child);
    puts("main");
}

int main()
{
    context_test();

    return 0;
}