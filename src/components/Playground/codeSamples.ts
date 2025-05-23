const codeSamples = {
    java: `// Simple CRUD Menu in Java
  import java.util.*;
  
  class Item {
      int id;
      String name;
      Item(int id, String name) {
          this.id = id;
          this.name = name;
      }
  }
  
  public class Main {
      static List<Item> items = new ArrayList<>();
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int choice;
          do {
              System.out.println("\\n--- CRUD Menu ---");
              System.out.println("1. Create\\n2. Read\\n3. Update\\n4. Delete\\n0. Exit");
              System.out.print("Choose: ");
              choice = sc.nextInt();
              sc.nextLine();
              switch (choice) {
                  case 1:
                      System.out.print("Enter ID: ");
                      int id = sc.nextInt();
                      sc.nextLine();
                      System.out.print("Enter Name: ");
                      String name = sc.nextLine();
                      items.add(new Item(id, name));
                      System.out.println("Item added!");
                      break;
                  case 2:
                      System.out.println("--- Item List ---");
                      for (int i = 0; i < items.size(); i++)
                          System.out.println((i+1) + ". ID: " + items.get(i).id + ", Name: " + items.get(i).name);
                      break;
                  case 3:
                      System.out.print("Enter ID to update: ");
                      id = sc.nextInt();
                      sc.nextLine();
                      boolean found = false;
                      for (Item item : items) {
                          if (item.id == id) {
                              System.out.print("Enter new name: ");
                              item.name = sc.nextLine();
                              System.out.println("Item updated!");
                              found = true;
                              break;
                          }
                      }
                      if (!found) System.out.println("Item not found!");
                      break;
                  case 4:
                      System.out.print("Enter ID to delete: ");
                      id = sc.nextInt();
                      sc.nextLine();
                      found = false;
                      Iterator<Item> it = items.iterator();
                      while (it.hasNext()) {
                          Item item = it.next();
                          if (item.id == id) {
                              it.remove();
                              System.out.println("Item deleted!");
                              found = true;
                              break;
                          }
                      }
                      if (!found) System.out.println("Item not found!");
                      break;
                  case 0:
                      System.out.println("Goodbye!");
                      break;
                  default:
                      System.out.println("Invalid choice!");
              }
          } while (choice != 0);
          sc.close();
      }
  }
  `,
    go: `// Simple CRUD Menu in Go
  package main
  
  import (
      "bufio"
      "fmt"
      "os"
      "strconv"
      "strings"
  )
  
  type Item struct {
      ID   int
      Name string
  }
  
  var items []Item
  
  func main() {
      reader := bufio.NewReader(os.Stdin)
      for {
          fmt.Println("\\n--- CRUD Menu ---")
          fmt.Println("1. Create\\n2. Read\\n3. Update\\n4. Delete\\n0. Exit")
          fmt.Print("Choose: ")
          input, _ := reader.ReadString('\\n')
          choice, _ := strconv.Atoi(strings.TrimSpace(input))
          switch choice {
          case 1:
              var id int
              var name string
              fmt.Print("Enter ID: ")
              fmt.Scan(&id)
              fmt.Print("Enter Name: ")
              name, _ = reader.ReadString('\\n')
              name = strings.TrimSpace(name)
              items = append(items, Item{ID: id, Name: name})
              fmt.Println("Item added!")
          case 2:
              fmt.Println("--- Item List ---")
              for i, item := range items {
                  fmt.Printf("%d. ID: %d, Name: %s\\n", i+1, item.ID, item.Name)
              }
          case 3:
              var id int
              fmt.Print("Enter ID to update: ")
              fmt.Scan(&id)
              found := false
              for i := range items {
                  if items[i].ID == id {
                      fmt.Print("Enter new name: ")
                      name, _ := reader.ReadString('\\n')
                      items[i].Name = strings.TrimSpace(name)
                      fmt.Println("Item updated!")
                      found = true
                      break
                  }
              }
              if !found {
                  fmt.Println("Item not found!")
              }
          case 4:
              var id int
              fmt.Print("Enter ID to delete: ")
              fmt.Scan(&id)
              found := false
              for i := range items {
                  if items[i].ID == id {
                      items = append(items[:i], items[i+1:]...)
                      fmt.Println("Item deleted!")
                      found = true
                      break
                  }
              }
              if !found {
                  fmt.Println("Item not found!")
              }
          case 0:
              fmt.Println("Goodbye!")
              return
          default:
              fmt.Println("Invalid choice!")
          }
      }
  }
  `,
    node: `// Simple CRUD Menu in JavaScript (Node.js)
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  let items = [];
  
  function menu() {
    console.log("\\n--- CRUD Menu ---");
    console.log("1. Create\\n2. Read\\n3. Update\\n4. Delete\\n0. Exit");
    readline.question("Choose: ", choice => {
      switch (choice) {
        case "1":
          readline.question("Enter ID: ", id => {
            readline.question("Enter Name: ", name => {
              items.push({ id: Number(id), name });
              console.log("Item added!");
              menu();
            });
          });
          break;
        case "2":
          console.log("--- Item List ---");
          items.forEach((item, i) =>
            console.log(\`\${i + 1}. ID: \${item.id}, Name: \${item.name}\`)
          );
          menu();
          break;
        case "3":
          readline.question("Enter ID to update: ", id => {
            const item = items.find(item => item.id == id);
            if (item) {
              readline.question("Enter new name: ", name => {
                item.name = name;
                console.log("Item updated!");
                menu();
              });
            } else {
              console.log("Item not found!");
              menu();
            }
          });
          break;
        case "4":
          readline.question("Enter ID to delete: ", id => {
            const idx = items.findIndex(item => item.id == id);
            if (idx !== -1) {
              items.splice(idx, 1);
              console.log("Item deleted!");
            } else {
              console.log("Item not found!");
            }
            menu();
          });
          break;
        case "0":
          console.log("Goodbye!");
          readline.close();
          process.exit(0);
          break;
        default:
          console.log("Invalid choice!");
          menu();
      }
    });
  }
  
  menu();
  `
  };

  export default codeSamples;