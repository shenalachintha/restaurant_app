using Microsoft.AspNetCore.Mvc;
using MyApp.Models;

namespace MyApp.Controllers
{
    public class ItemsContoller : Controller
    {
        public IActionResult Overview()
        {
            var item = new Item()
            {
                Name = "Keyboard"
            };
            return View(item);
        }

        public IActionResult Edit(int id)
        {
            return Content("id = " + id);
        }

    }
}
