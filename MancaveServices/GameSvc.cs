using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Mancave.MancaveServices
{
    public class GameSvc
    {
        private MancaveEntities db;

        public GameSvc()
        {
            db = new MancaveEntities();
        }

        public List<Game> GetGamesByCategory(int categoryId, out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();

            List<Game> games = db.Games.Where(g => g.GameCategory == categoryId).ToList();

            return games;
        }

        public Game GetGameById(int gameId, out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();

            Game game = db.Games.SingleOrDefault(g => g.Id == gameId);

            return game;
        }
    }
}
