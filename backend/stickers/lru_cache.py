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

    def remove(self,node):
        next_node = node.next
        prev_node = node.prev
        prev_node.next = next_node
        next_node.prev = prev_node
    
    def get(self,key):

        if key not in self.cache:
            return None
        
        node = self.cache[key]
        self.remove(node=node)
        self.add_front(node=node)

        return node.value
    
    def put(self, key, value):

        if key in self.cache:

            node = self.cache[key]
            self.remove(node=node)
            self.add_front(node=node)
        else:

            if len(self.cache) >= self.capacity:
                lru = self.tail.prev
                self.remove(node=lru)
                del self.cache[lru.key]

            newnode = Node(key=key, value= value)
            self.cache[key] = newnode
            self.add_front(newnode)
    
    def get_all_cache(self):
        result = []
        current = self.head.next
        while current != self.tail:
            result.append({current.key: current.value})
            current = current.next
        return result
            