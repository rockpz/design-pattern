class AbstractSubject():
    def attach(self, observer):
        raise NotImplementedError()

    def detach(self, observer):
        raise NotImplementedError()

    def notify(self, event):
        raise NotImplementedError()

class Subject(AbstractSubject):
    def __init__(self, name):
        self.observers = []
        self.name      = name
        self._data     = 0

    def attach(self, observer):
        self.observers.append(observer)

    def detach(self, observer):
        self.observers.remove(observer)

    def notify(self, event):
        for observer in self.observers:
            observer.update(self)

    @property
    def data(self):
        return self._data

    @data.setter
    def data(self, value):
        self._data = value
        self.notify('data changed!')

class HexObserver():
    def update(self, subject):
        print('HexObserver: Subject %s has data 0x%x' % (subject.name, subject.data))

class DecimalObserver():
    def update(self, subject):
        print('DecimalObserver: Subject %s has data %d' % (subject.name, subject.data))


if __name__ == '__main__':
    subject1 = Subject('TEST CASE')
    subject2 = Subject('HELLO WORLD')

    observer1 = HexObserver()
    observer2 = DecimalObserver()

    subject1.data = 5
    subject1.attach(observer1)
    subject1.data = 6
    subject1.attach(observer2)
    subject1.data = 7
    subject1.detach(observer1)
    subject1.data = 8

    subject2.data = 9
    subject2.attach(observer1)
    subject2.attach(observer2)
    subject2.data = 10
