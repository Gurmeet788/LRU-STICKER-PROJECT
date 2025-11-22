class Node:
    def __init__(self,key,value):
        self.key = key
        self.value = value
        self.next = None
        self.prev = None

class LRUcache:
    def __init__(self,capacity=10):
        self.capacity = capacity
        self.cache = {}

        self.head = Node(0,0)
        self.tail = Node(0,0)
        
        self.head.next = self.tail
        self.tail.prev = self

    def add_front(self,node):
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node
        node.prev = self.head