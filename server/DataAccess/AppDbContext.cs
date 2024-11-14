using System;
using System.Collections.Generic;
using DataAccess.Entities;
using DataAccess.models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DataAccess;


public partial class AppDbContext : IdentityDbContext<User>

{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    
}
