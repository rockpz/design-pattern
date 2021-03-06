1: 观察者模式
一个目标对象管理所有相依于它的观察者对象，并且在它本身的状态改变时主动发出通知。
这通常透过呼叫各观察者所提供的方法来实现。此种模式通常被用来实时事件处理系统。

用途
    当抽象个体有两个互相依赖的层面时。封装这些层面在单独的对象内将可允许程序员单独地去变更与使用这些对象，而不会产生两者之间交互的问题。当其中一个对象的变更会影响其他对象，却又不知道多少对象必须被同时变更时。当对象应该有能力通知其他对象，又不应该知道其他对象的实做细节时。

目标对象具备产生事件的能力，目标提供注册事件，取消事件，事件通知的接口。事件通知接口中会调用观察者处理事件的接口
观察者对象都有处理事件的接口，观察者调用目标对象的接口去关注和取消目标对象事件；观察者需要知道目标对象的注册、取消事件，事件通知的接口。

attach 观察者调用目标对象接口关注目标事件
detach 观察者调用目标对象接口取消关注目标事件
notify 目标产生事件后，通知观察者，调用观察者处理事件接口
update 观察者处理事件接口

优点：
    1: 观察者模式在被观察者和观察者之间建立一个抽象的耦合。被观察者角色所知道的只是一个具体观察者聚集，每个具体观察者都符合一个抽象观察者的接口。被观察者并不认识任何一个具体的观察者，它只知道它们都有一个共同的接口。由于被观察者和观察者没有紧密地耦合在一起，因此它们可以属于不同的抽象化层次。
    2: 观察者模式支持广播通信。被观察者会向所有的登记过的观察者发出通知。
缺点：
    1: 如果一个被观察者对象有很多直接和间接的观察者的话，将所有的观察者都通知到会花费很多时间。
    2: 如果在被观察者之间有循环依赖的话，被观察者会触发它们之间进行循环调用，导致系统崩溃。在使用观察者模式时要特别注意这一点。
    3: 如果对观察者的通知是通过另外的线程进行异步投递的话，系统必须保证投递是以自恰的方式进行的。
    4: 虽然观察者模式可以随时使观察者知道所观察的对象发生了变化，但是观察者模式没有相应的机制使观察者知道所观察的对象是怎么发生变化的。



2: 生产者／消费者模式
    也称有限缓冲问题，是一个多线程同步的经典案例。该问题描述了共享大小缓冲区的两个线程－－即所谓的生产者和消费者在实际运行时会发生的问题。生产者将生成的数据放到缓冲区中，消费者消耗缓冲区中的数据。该问题的关键是要保证生产者不会在缓冲区满时加入数据，消费者也不会在缓冲区空时消耗数据。


权限、跳转、埋点、异常、描述、注入等等

